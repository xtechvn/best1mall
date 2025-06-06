﻿using System;
using System.Collections.Generic;

namespace Best1Mall_Front_End.Models.Raiting;

public partial class Rating
{
    public int Id { get; set; }

    public int? OrderId { get; set; }

    public string ProductId { get; set; }

    public decimal? Star { get; set; }

    public string Comment { get; set; }

    public string ImgLink { get; set; }

    public string VideoLink { get; set; }

    public int? UserId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? UpdatedDate { get; set; }

    public int? UpdatedBy { get; set; }
}
