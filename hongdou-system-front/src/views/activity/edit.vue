<template>
  <div>
    <el-form style="padding: 20px;" ref="form" :model="activity" label-width="80px">
      <el-form-item label="标题">
        <el-input v-model="activity.title"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="activity.content"></el-input>
      </el-form-item>
      <el-form-item label="图片" v-for="(item, index) in activity.images">
        <template slot-scope="scope">
          <img :src="item.download_url" width="100" height="100"/>
          <el-button type="danger" @click="onDelete(item)">删除</el-button>
        </template>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onCancel()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
    import {getActivityDetail} from "@/api/activity";

    export default {
        data() {
            return {
                activity: {}
            }
        },
        created() {
            getActivityDetail(this.$route.params.id).then(res => {
                this.activity = res.data
            })
        },
        methods: {
            onSubmit(event) {

            },
            onCancel(row) {
                console.log(row)
            },
            onDelete(item) {
                console.log(item)
            }
        }
    }
</script>

<style scoped>

</style>
