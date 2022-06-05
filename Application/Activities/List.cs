using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Activities
{
    public class List
    {
        public record Query(ActivityParams Params) : IRequest<Result<PagedList<ActivityDto>>>;

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, ILogger<List> logger, IMapper mapper, IUserAccessor userAccessor)
            {
                this._mapper = mapper;
                this._userAccessor = userAccessor;
                this._context = context;
                this._logger = logger;
            }
            
            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                try
                {

                    for (var i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        this._logger.LogInformation($"Task {i} has completed");
                        // await Task.Delay(1000, cancellationToken);
                    }
                }
                catch (Exception ex) when (ex is OperationCanceledException)
                {
                    this._logger.LogInformation("Operation cancelled");
                }

                var query = this._context.Activities
                    .Where(d => d.Date >= request.Params.StartDate)
                    .OrderBy(d => d.Date)
                    .ProjectTo<ActivityDto>(this._mapper.ConfigurationProvider, new {currentUserName = this._userAccessor.GetUserName()})
                    .AsQueryable();

                if(request.Params.IsGoing && request.Params.IsHost is false)
                {
                    query = query.Where(x => x.Attendees.Any(a => a.Username == this._userAccessor.GetUserName()));
                }

                if(request.Params.IsHost)
                {
                    query = query.Where(x => x.HostUsername == this._userAccessor.GetUserName());
                }
                

                var activities = await PagedList<ActivityDto>.CreateAsync(query, request.Params.PageNumber, request.Params.PageSize);
                return Result<PagedList<ActivityDto>>.Success(activities);
            }
        }
    }
}
