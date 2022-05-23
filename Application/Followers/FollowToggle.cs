using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    public class FollowToggle
    {
        public record Command(string TargetUsername) : IRequest<Result<Unit>>;

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _contex;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext contex, IUserAccessor userAccessor)
            {
                this._userAccessor = userAccessor;
                this._contex = contex;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await this._contex.Users.FirstOrDefaultAsync(x => x.UserName == this._userAccessor.GetUserName());

                var target = await this._contex.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target is null)
                {
                    return null;
                }

                var following = await this._contex.UserFollowings.FindAsync(observer!.Id, target.Id);

                if (following is null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };
                    this._contex.UserFollowings.Add(following);
                }
                else
                {
                    this._contex.UserFollowings.Remove(following);
                }

                var success = await this._contex.SaveChangesAsync() > 0;

                if(success){
                    return Result<Unit>.Success(Unit.Value);
                }

                return Result<Unit>.Failure("Failed to update following");
            }
        }
    }
}