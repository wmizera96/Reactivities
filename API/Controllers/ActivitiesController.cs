using Application.Activities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await this.Mediator.Send(new List.Query());
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            return await Mediator.Send(new Details.Query(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            return Ok(await Mediator.Send(new Create.Command(activity)));
        }
    }
}