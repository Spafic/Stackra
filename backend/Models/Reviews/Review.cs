using System;

namespace Stackra.Backend.Models;

public class Review
{
    public int ReviewId { get; set; }
    public decimal? FlRating { get; set; }
    public string FlDescription { get; set; }
    public decimal? ClRating { get; set; }
    public string ClDescription { get; set; }
    public int JobId { get; set; }
    public int? AdminId { get; set; }
}
