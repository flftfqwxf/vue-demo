<template>
  <div class="form-horizontal">
    <div class="form-group">
      <label  class="col-sm-3 control-label">
        A default datetime picker:
      </label>
        <!--<vue-datetime-picker  name="picker1" ></vue-datetime-picker>-->
        <!--<div v-vue-datetime-picker ></div>-->
        <vue-datetime-picker  name="picker1" :model.sync="result1">
        </vue-datetime-picker>
      </div>

    </div>

  </div>
</template>

<script>
    import vueDatetimePicker from '../bootstrap-datepicker/vue-datetime-picker.js'
//    import vueDatetimePicker from 'vue-datetime-picker'

    module.exports = {
    data: function() {
        return {
            result1: null,
            result2: null,
            result3: null,
            result4: null,
            startDatetime: moment(),
            endDatetime: null
        };
    },
  components: {
      vueDatetimePicker
  }
};
</script>