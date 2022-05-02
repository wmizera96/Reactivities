using Microsoft.AspNetCore.Identity;

public class Seed
{
    public static async Task SeedDataAsync(DataContext context, UserManager<AppUser> userManager)
    {
        if (userManager.Users.Any() == false)
        {
            var users = new List<AppUser>{
                new AppUser{
                    DisplayName = "Bob",
                    UserName = "bob",
                    Email = "bob@test.com"
                },
                new AppUser{
                    DisplayName = "Tom",
                    UserName = "tom",
                    Email = "tom@test.com"
                },
                new AppUser{
                    DisplayName = "Jane",
                    UserName = "jane",
                    Email = "jane@test.com"
                }
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }

        if (context.Activities.Any()) return;

        var activities = new List<Activity>
        {
            new Activity(
                "Past Activity 1",
                DateTime.Now.AddMonths(-2),
                "Activity 2 months ago",
                "drinks",
                "London",
                "Pub"
            ),
            new Activity(
                "Past Activity 2",
                DateTime.Now.AddMonths(-1),
                "Activity 1 month ago",
                "culture",
                "Paris",
                "Louvre"
            ),
            new Activity(
                "Future Activity 1",
                DateTime.Now.AddMonths(1),
                "Activity 1 month in future",
                "culture",
                "London",
                "Natural History Museum"
            ),
            new Activity(
                "Future Activity 2",
                DateTime.Now.AddMonths(2),
                "Activity 2 months in future",
                "music",
                "London",
                "O2 Arena"
            ),
            new Activity
            (
                "Future Activity 3",
                DateTime.Now.AddMonths(3),
                "Activity 3 months in future",
                "drinks",
                "London",
                "Another pub"
            ),
            new Activity
            (
                "Future Activity 4",
                DateTime.Now.AddMonths(4),
                "Activity 4 months in future",
                "drinks",
                "London",
                "Yet another pub"
            ),
            new Activity
            (
                "Future Activity 5",
                DateTime.Now.AddMonths(5),
                "Activity 5 months in future",
                "drinks",
                "London",
                "Just another pub"
            ),
            new Activity
            (
                "Future Activity 6",
                DateTime.Now.AddMonths(6),
                "Activity 6 months in future",
                "music",
                "London",
                "Roundhouse Camden"
            ),
            new Activity
            (
                "Future Activity 7",
                DateTime.Now.AddMonths(7),
                "Activity 2 months ago",
                "travel",
                "London",
                "Somewhere on the Thames"
            ),
            new Activity
            (
                "Future Activity 8",
                DateTime.Now.AddMonths(8),
                "Activity 8 months in future",
                "film",
                "London",
                "Cinema"
            )
        };

        await context.Activities.AddRangeAsync(activities);
        await context.SaveChangesAsync();
    }
}