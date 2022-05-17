using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
    public class Edit
    {
        public record Command(string? DisplayName, string? Bio) : IRequest<Result<Unit>> { }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                this._dataContext = dataContext;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await this._dataContext.Users.FirstOrDefaultAsync(u => u.UserName == this._userAccessor.GetUserName());

                if(user is null)
                    return null;

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio;

                var success = await this._dataContext.SaveChangesAsync() > 0;

                if(success){
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Error updating profile");
            }
        }

    }
}