using System.Collections.Generic;
using Content.GraphQL.Annotations;
using Content.GraphQL.Definitions.Types;

namespace Content.GraphQL.Models.Input
{
    public class SiteInput
    {
        public string Id { get; set; }
        public string Name { get; set; }
        [MapsToData(SiteType.TITLE_KEY)]
        public string Title { get; set; }
        [MapsToData(SiteType.SUBTITLE_KEY)]
        public string Subtitle { get; set; }
        [MapsToData(SiteType.GOOGLE_ANALYTICS_ID_KEY)]
        public string GoogleAnalyticsId { get; set; }
        [MapsToData(SiteType.COPYRIGHT_KEY)]
        public string Copyright { get; set; }

        // TODO: header image
        // TODO: social media
        // TODO: top level navigation
    }
}