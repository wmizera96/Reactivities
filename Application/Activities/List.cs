using Application.Core;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

public class List
{
    public class Query : IRequest<Result<List<Activity>>> { }

    public class Handler : IRequestHandler<Query, Result<List<Activity>>>
    {
        private readonly DataContext _context;
        private readonly ILogger _logger;
        public Handler(DataContext context, ILogger<List> logger)
        {
            this._context = context;
            this._logger = logger;

        }
        public async Task<Result<List<Activity>>> Handle(Query request, CancellationToken cancellationToken)
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

            return Result<List<Activity>>.Success(await this._context.Activities.ToListAsync(cancellationToken));
        }
    }
}
