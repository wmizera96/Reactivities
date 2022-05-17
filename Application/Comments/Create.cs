using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentDto>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this._context = context;
                this._mapper = mapper;
                this._userAccessor = userAccessor;
            }

            public async Task<Result<CommentDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await this._context.Activities.FindAsync(request.ActivityId);

                if (activity is null)
                    return null;

                var user = await this._context.Users
                    .Include(p => p.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == this._userAccessor.GetUserName());

                var comment = new Comment {
                    Author = user,
                    Activity = activity,
                    Body = request.Body,
                };

                activity.Comments.Add(comment);

                var success = await this._context.SaveChangesAsync() > 0;

                if(success)
                {
                    return Result<CommentDto>.Success(this._mapper.Map<CommentDto>(comment));
                }

                return Result<CommentDto>.Failure("Failed to add comment");
            }
        }
    }
}