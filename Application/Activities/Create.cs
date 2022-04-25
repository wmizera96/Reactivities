using MediatR;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest
        {

            public Command(Activity activity)
            {
                this.Activity = activity;
            }

            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                this._context.Add(request.Activity);
                await this._context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}