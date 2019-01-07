import * as Yup from 'yup'
import { Site } from '../common/SiteQuery';

interface ContactIcon {
    type: string,
    value: string
}

interface SiteSettings {
    title: string
    subtitle: string
    copyright: string
    googleAnalyticsId: string,
    contactIcons: ContactIcon[]
}

const SiteSettingsSchema = Yup.object().shape({
    title: Yup.string().required(),
    subtitle: Yup.string(),
    copyright: Yup.string(),
    googleAnalyticsId: Yup.string(),
})

export function getSiteSettings(site: Site) {
    const siteSettings = JSON.parse(site.data) as SiteSettings;
    SiteSettingsSchema.validateSync(siteSettings);

    if (!siteSettings.contactIcons) {
        siteSettings.contactIcons = []
    }

    return siteSettings;
}