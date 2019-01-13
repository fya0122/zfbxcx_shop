Component({
  data: {},
  props: {
    img: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: []
    },
    price: {
      type: String,
      value: ''
    },
    likecount: {
      type: String,
      value: ''
    },
    id: {
      type: String
    },
    onGoToDetail: () => {}
  },
  methods: {
    goToDetail(e) {
      this.props.onGoToDetail({
        id: e.currentTarget.dataset.id
      })
    }
  }
});
