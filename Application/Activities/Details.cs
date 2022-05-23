using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;


namespace Application.Activities
{
    public class Details
    {
        public record Query(Guid Id) : IRequest<Result<ActivityDto>>;

        public class Handler : IRequestHandler<Query, Result<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
        private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
            this._userAccessor = userAccessor;
                this._mapper = mapper;
                this._context = context;
            }

            public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities
                    .ProjectTo<ActivityDto>(this._mapper.ConfigurationProvider, new {currentUserName = this._userAccessor.GetUserName()})
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                return Result<ActivityDto>.Success(activity);
            }
        }
    }
}