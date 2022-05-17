using Application.Activities;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Activities
{


    public class List
    {
        public record Query() : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            private readonly IMapper _mapper;
            public Handler(DataContext context, ILogger<List> logger, IMapper mapper)
            {
                this._mapper = mapper;
                this._context = context;
                this._logger = logger;

            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
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

                var activities = await this._context.Activities
                    .ProjectTo<ActivityDto>(this._mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}
