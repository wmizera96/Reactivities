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
}