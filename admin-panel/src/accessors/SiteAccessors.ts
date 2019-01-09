import * as Yup from 'yup'
import { Site } from '../common/SiteQuery';

export interface ContactIcon {
    type: string,
    value: string
}

export interface SiteSettings {
    title: string
    subtitle: string
    copyright: string
    headerImage: string
    googleAnalyticsId: string,
    contactIcons: ContactIcon[]
}

export const SiteSettingsSchema = Yup.object().shape({
    title: Yup.string(),
    subtitle: Yup.string(),
    headerImage: Yup.string(),
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