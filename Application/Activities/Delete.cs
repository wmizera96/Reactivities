using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
            public Command(Guid id)
            {
                this.Id = id;

            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                this._context = context;

            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities.FindAsync(request.Id);

                // if (activity is null)
                    // return null;

                this._context.Remove(activity);
                var result = await this._context.SaveChangesAsync() > 0;

                if (result is false)
                    return Result<Unit>.Failure("Failed to delete the activity");


                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}