using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

#nullable disable

public class AppUser : IdentityUser
{
    public string DisplayName { get; set; }
    public string Bio { get; set; }
    public ICollection<ActivityAttendee> Activities { get; set; }
    public ICollection<Photo> Photos { get; set; }

    public ICollection<UserFollowing> Followings {get;set;}
    public ICollection<UserFollowing> Followers { get; set; }
}