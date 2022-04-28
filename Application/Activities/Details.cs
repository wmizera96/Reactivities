using Application.Core;
using MediatR;

public class Details
{
    public class Query : IRequest<Result<Activity>>
    {
        public Query(Guid id)
        {
            this.Id = id;
        }
        
        public Guid Id { get; set; }
    }


    public class Handler : IRequestHandler<Query, Result<Activity>>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            this._context = context;
        }

        public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await this._context.Activities.FindAsync(request.Id);

            return Result<Activity>.Success(activity);
        }
    }
}