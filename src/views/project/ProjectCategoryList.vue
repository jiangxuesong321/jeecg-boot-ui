<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>
      <a-button type="primary" icon="download" @click="handleExportXls('project_category')">导出</a-button>
      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">
        <a-button type="primary" icon="import">导入</a-button>
      </a-upload>
      <!-- 高级查询区域 -->
      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>
      <a-dropdown v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-menu-item key="1" @click="batchDel"><a-icon type="delete"/>删除</a-menu-item>
        </a-menu>
        <a-button style="margin-left: 8px"> 批量操作 <a-icon type="down" /></a-button>
      </a-dropdown>
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
          <a @click="handleEdit(record)">编辑</a>

          <a-divider type="vertical" />
          <a-dropdown>
            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>
            <a-menu slot="overlay">
              <a-menu-item>
                <a @click="handleDetail(record)">详情</a>
              </a-menu-item>
              <a-menu-item>
                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">
                  <a>删除</a>
                </a-popconfirm>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
        </span>

      </a-table>
    </div>

    <project-category-modal ref="modalForm" @ok="modalFormOk"></project-category-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import ProjectCategoryModal from './modules/ProjectCategoryModal'

  export default {
    name: 'ProjectCategoryList',
    mixins:[JeecgListMixin, mixinDevice],
    components: {
      ProjectCategoryModal
    },
    data () {
      return {
        description: 'project_category管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key:'rowIndex',
            width:60,
            align:"center",
            customRender:function (t,r,index) {
              return parseInt(index)+1;
            }
          },
          {
            title:'父ID',
            align:"center",
            dataIndex: 'parentId'
          },
          {
            title:'分类名称',
            align:"center",
            dataIndex: 'name'
          },
          {
            title:'层级',
            align:"center",
            dataIndex: 'level'
          },
          {
            title:'是否设备清单',
            align:"center",
            dataIndex: 'isEqp'
          },
          {
            title:'预算费用',
            align:"center",
            dataIndex: 'budgetAmount'
          },
          {
            title:'设备ID',
            align:"center",
            dataIndex: 'projectId'
          },
          {
            title:'排序',
            align:"center",
            dataIndex: 'sort'
          },
          {
            title:'租户ID',
            align:"center",
            dataIndex: 'tenantId'
          },
          {
            title:'删除标志位',
            align:"center",
            dataIndex: 'delFlag'
          },
          {
            title:'创建人',
            align:"center",
            dataIndex: 'createUser'
          },
          {
            title:'更新人',
            align:"center",
            dataIndex: 'updateUser'
          },
          {
            title: '操作',
            dataIndex: 'action',
            align:"center",
            fixed:"right",
            width:147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/srm/projectCategory/list",
          delete: "/srm/projectCategory/delete",
          deleteBatch: "/srm/projectCategory/deleteBatch",
          exportXlsUrl: "/srm/projectCategory/exportXls",
          importExcelUrl: "srm/projectCategory/importExcel",
          
        },
        dictOptions:{},
        superFieldList:[],
      }
    },
    created() {
    this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function(){
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig(){
      },
      getSuperFieldList(){
        let fieldList=[];
        fieldList.push({type:'string',value:'parentId',text:'父ID'})
        fieldList.push({type:'string',value:'name',text:'分类名称'})
        fieldList.push({type:'string',value:'level',text:'层级'})
        fieldList.push({type:'string',value:'isEqp',text:'是否设备清单'})
        fieldList.push({type:'number',value:'budgetAmount',text:'预算费用'})
        fieldList.push({type:'string',value:'projectId',text:'设备ID'})
        fieldList.push({type:'int',value:'sort',text:'排序'})
        fieldList.push({type:'string',value:'tenantId',text:'租户ID'})
        fieldList.push({type:'string',value:'delFlag',text:'删除标志位'})
        fieldList.push({type:'string',value:'createUser',text:'创建人'})
        fieldList.push({type:'string',value:'updateUser',text:'更新人'})
        this.superFieldList = fieldList
      }
    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>