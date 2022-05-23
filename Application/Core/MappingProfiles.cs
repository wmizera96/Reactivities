using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
            .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(a => a.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName))
                .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                .ForMember(p => p.Image, o => o.MapFrom(u => u.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(p => p.FollowersCount, o => o.MapFrom(u => u.AppUser.Followers.Count))
                .ForMember(p => p.FollowingCount, o => o.MapFrom(u => u.AppUser.Followings.Count))
                .ForMember(p => p.Following, o => o.MapFrom(s => s.AppUser.Followers.Any(s => s.Observer.UserName == currentUserName)));;

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(p => p.Image, o => o.MapFrom(u => u.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(p => p.FollowersCount, o => o.MapFrom(u => u.Followers.Count))
                .ForMember(p => p.FollowingCount, o => o.MapFrom(u => u.Followings.Count))
                .ForMember(p => p.Following, o => o.MapFrom(s => s.Followers.Any(s => s.Observer.UserName == currentUserName)));

            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName))
                .ForMember(p => p.Image, o => o.MapFrom(u => u.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}