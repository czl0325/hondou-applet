// components/item-activity/index.js
import utils from '../../utils/utils.js'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activity: Object
  },

  observers: {
    ['activity.createTime'](val) {
      if (val) {
        this.setData({
          _createTime: utils.formatTime(val)
        })
      }
    },
    ['activity.images'](val) {
      if (val) {
        if (val.length > 3) {
          val = val.slice(0, 3)
        }
        this.setData({
          _images: val
        })
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    _images: [],
    _createTime: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClickActivity(event) {
      this.triggerEvent('click', {
        activity: this.properties.activity
      })
    }
  }
})
