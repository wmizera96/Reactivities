using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string? Id { get; set; }

            public Command(string? id)
            {
                Id = id;
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await this._dataContext.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == this._userAccessor.GetUserName());

                if (user is null)
                {
                    return null;
                }

                // no need to make it async, because we've already loaded all images in line 34
                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

                if (photo is null)
                {
                    return null;
                }

                if (photo.IsMain)
                {
                    return Result<Unit>.Failure("You can not delete your main photo");
                }

                var result = await this._photoAccessor.DeletePhoto(photo.Id);

                if (result is null)
                {
                    return Result<Unit>.Failure("Problem deleting photo from Cloudinary");
                }

                user.Photos.Remove(photo);

                var success = await this._dataContext.SaveChangesAsync() > 0;

                if (success)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}