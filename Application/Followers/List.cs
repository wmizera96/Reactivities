using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Application.Profiles;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    public class List
    {
        public record Query(string Predicate, string Username) : IRequest<Result<List<Profiles.Profile>>>;

        public class Handler : IRequestHandler<Query, Result<List<Profiles.Profile>>>
        {
            private readonly DataContext _context;
            private IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this._context = context;
                this._mapper = mapper;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<List<Profiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = await (request.Predicate switch
                {
                    "followers" => this._context.UserFollowings.Where(x => x.Target.UserName == request.Username).Select(x => x.Observer),
                    "following" => this._context.UserFollowings.Where(x => x.Observer.UserName == request.Username).Select(x => x.Target),
                })
                    .ProjectTo<Profiles.Profile>(this._mapper.ConfigurationProvider, new {currentUserName = this._userAccessor.GetUserName()})
                    .ToListAsync();


                return Result<List<Profiles.Profile>>.Success(profiles);
            }
        }
    }
}