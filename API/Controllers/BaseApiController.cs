using API.Extensions;
using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;


namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        private IMediator? _mediator;

        protected IMediator Mediator => this._mediator ??= HttpContext.RequestServices.GetService<IMediator>()!;

        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if(result is null)
                return NotFound();
            if (result.IsSuccess && result.Value is not null)
                return Ok(result.Value);
            if (result.IsSuccess && result.Value is null)
                return NotFound();
            return BadRequest(result.Error);
        }

        protected ActionResult HandlePagedResult<T>(Result<PagedList<T>> result)
        {
            if(result is null)
                return NotFound();
            if (result.IsSuccess && result.Value is not null)
            {
                var value = result.Value;
                Response.AddPaginationHeader(value.CurrentPage, value.PageSize, value.TotalCount, value.TotalPages);
                return Ok(result.Value);
            }
            if (result.IsSuccess && result.Value is null)
                return NotFound();
            return BadRequest(result.Error);
        }
    }
}