import { isNewUserActivityAndNewUser } from '../utils/public'

export default Behavior({
  methods: {
    /**
     * @description 商品详情页跳转
     * 需要判断当前团购是否存在新人团，当前用户是否为新人。
     */
    jumpPage () {
      let { spuItem: { promotionDTO, actId, spuId, skuId }, preSeat } = this.data
      let params = [
        `actId=${actId}`,
        `spuId=${spuId}`,
        `skuId=${skuId}`,
        `preSeat=${preSeat}`,
      ]

      let cb = (path) => {
        wx.navigateTo({
          url: `/pages/goods/${path}?${params.join('&')}`
        })
      }

      isNewUserActivityAndNewUser(promotionDTO, skuId, cb.bind(this, 'goodsDetail'), cb.bind(this, 'new-user-goods-detail'))
    }
  }
})
