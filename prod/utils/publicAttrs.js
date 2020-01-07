
export default app => {
  return {
    platform_type: 'MP',
    community: app.globalData.community.communityName || '',
    communityID: app.globalData.community.communityId || '',
    affiliate_type: app.globalData.affiliate_type,
    manage_city_code: app.globalData.community.manageCityCode || '',
  }
}
