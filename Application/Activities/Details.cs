using Application.Activities;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;

public class Details
{
    public class Query : IRequest<Result<ActivityDto>>
    {
        public Query(Guid id)
        {
            this.Id = id;
        }
        
        public Guid Id { get; set; }
    }


    public class Handler : IRequestHandler<Query, Result<ActivityDto>>
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public Handler(DataContext context, IMapper mapper)
        {
            this._mapper = mapper;
            this._context = context;
        }

        public async Task<Result<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
        {
            var activity = await this._context.Activities
                .ProjectTo<ActivityDto>(this._mapper.ConfigurationProvider)
                .FirstOrDefaultAsync(x => x.Id == request.Id);

            return Result<ActivityDto>.Success(activity);
        }
    }
}