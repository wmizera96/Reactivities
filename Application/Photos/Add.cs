using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext _dataContext;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext dataContext, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._photoAccessor = photoAccessor;
                this._dataContext = dataContext;

            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await this._dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == this._userAccessor.GetUserName());

                if (user is null)
                {
                    return null;
                }

                var photoUploadResult = await this._photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!user.Photos.Any(x => x.IsMain))
                {
                    photo.IsMain = true;
                }

                user.Photos.Add(photo);

                var result = await this._dataContext.SaveChangesAsync() > 0;

                if (result)
                {
                    return Result<Photo>.Success(photo);
                }

                return Result<Photo>.Failure("Problem uploading photo");
            }
        }
    }
}