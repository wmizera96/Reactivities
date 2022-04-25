using MediatR;
using Microsoft.EntityFrameworkCore;

public class List
{
    public class Query : IRequest<List<Activity>> { }

    public class Handler : IRequestHandler<Query, List<Activity>>
    {
        private readonly DataContext _context;
        public Handler(DataContext context)
        {
            this._context = context;
            
        }
        public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
        {
            return await this._context.Activities.ToListAsync();
        }
    }
}
