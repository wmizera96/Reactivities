using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; }

            public Query(string username)
            {
                this.Username = username;
            }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this._context = context;
                this._mapper = mapper;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await this._context.Users.ProjectTo<Profile>(this._mapper.ConfigurationProvider, new { currentUserName = this._userAccessor.GetUserName() })
                    .SingleOrDefaultAsync(x => x.Username == request.Username);

                if (user is null)
                    return null;

                return Result<Profile>.Success(user);
            }
        }
    }
}