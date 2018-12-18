namespace Content.Data.Models
{
    public class AssetSlice
    {
        public string AssetId { get; set; }
        public Asset Asset { get; set; }
        public string SliceId { get; set; }
        public Slice Slice { get; set; }
    }
}