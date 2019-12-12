<template>
  <div>
    <el-table v-loading="loading" :data="activity_list" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="title" label="活动标题"></el-table-column>
      <el-table-column label="活动详情">
        <template slot-scope="scope">
          <div v-html="scope.row.content"></div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
    import {getActivityList} from '@/api/activity'
    let pageNum = 0
    export default {
        data() {
            return {
                activity_list: [],
                loading: false,
                delDialogVisible: false
            }
        },
        created() {
            this.loading = true
            getActivityList(pageNum).then(res => {
                this.loading = false
                this.activity_list = this.activity_list.concat(res.data)
            }).catch(err => {
                console.error(err)
            })
        },
        methods: {
            onEdit(row) {
                console.log(row)
                this.$router.push(`/activity/edit/${row._id}`)
            },
            onDelete(row) {

            }
        }
    }
</script>

<style scoped>

</style>
