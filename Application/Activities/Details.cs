using MediatR;

public class Details
{
    public class Query : IRequest<Activity>
    {
        public Query(Guid id)
        {
            this.Id = id;
        }
        
        public Guid Id { get; set; }
    }


    public class Handler : IRequestHandler<Query, Activity>
    {
        private readonly DataContext _context;

        public Handler(DataContext context)
        {
            this._context = context;
        }

        public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
        {
            return await this._context.Activities.FindAsync(request.Id);
        }
    }
}