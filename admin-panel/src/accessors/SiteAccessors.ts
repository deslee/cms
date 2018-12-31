import * as Yup from 'yup'

interface SiteSettings {
    title: string
    subtitle: string
    copyright: string
    googleAnalyticsId: string
}

const SiteSettingsSchema = Yup.object().shape({
    title: Yup.string().required(),
    subtitle: Yup.string(),
    copyright: Yup.string(),
    googleAnalyticsId: Yup.string(),
})

export function getSiteSettings(site) {
    if (site.__typename !== 'Site') {
        throw new Error("Assert fail")
    }

    const data = JSON.parse(site.data);
    SiteSettingsSchema.validateSync(data);

    return data as SiteSettings
}