using Application.Core;
using AutoMapper;
using FluentValidation;
using MediatR;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Command(Activity activity)
            {
                this.Activity = activity;
            }

            public Activity Activity { get; set; }
        }


        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            public Handler(DataContext context, IMapper mapper)
            {
                this._mapper = mapper;
                this._context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.FindAsync<Activity>(request.Activity.Id);

                if(activity is null) 
                    return null;

                this._mapper.Map(request.Activity, activity);

                var result = await this._context.SaveChangesAsync() > 0;

                if(result is false)
                    return Result<Unit>.Failure("Failed to update activity");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}