<template>
  <div class="page-header-index-wide">
    <a-row>
      <j-dict-select-tag v-model="queryParam.projId"
                         placeholder="请选择项目"
                         :allowClear="allowClear"
                         style="width: 220px;    position: absolute;    top: -65px;-index: 99999999; right: 10px;float: right;    margin-right: 10px;"
                         dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"
                         @change="searchQuery" />
    </a-row>
    <a-row v-if="queryParam.projId != null && queryParam.projId != '' && queryParam.projId != undefined">
      <div class="card-title" style="margin-left: 13px">
        {{queryParam.projName}}
<!--        <marquee scrollamount=15> <FONT color=#f4a460 size=4>{{queryParam.projName}}</FONT></marquee>-->
      </div>
    </a-row>
    <a-row :gutter="24">

      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index ">
          <div class="right-content orange-money">
            <div style="display: inline-block;">
              <div class="card-title-font">
                <a @click="jumpProj">项目总投</a>
              </div>
              <div class="cont-data">
                <a @click="openBudgetAmount">{{ iegAmount(Math.trunc(model.budgetAmount), 'total') }}</a>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index ">
          <div class="right-content green-money">
            <div style="display: inline-block;">
              <div class="card-title-font">
                <a @click="jumpContract">合同总额</a>
              </div>
              <div class="cont-data">
                <a @click="openContractAmount">{{ iegAmount(Math.trunc(model.contractAmountTaxLocal),'total') }}</a>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index ">
          <div class="right-content pink-money">
            <div style="display: inline-block;">
              <div class="card-title-font">
                <a @click="jumpPlan">支出总额</a>
              </div>
              <div class="cont-data">
                <a @click="openPayAmount">{{ iegAmount(Math.trunc(model.payAmount),'total') }}</a>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">

      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index ">
          <img src="~@/assets/img_1.png" style="width: 30px;height: 30px;float: left;position:absolute;margin-left: 31px;margin-top: 13px">
          <div class="right-content yellow-number">
            <div style="display: inline-block;">
              <div class="card-title-font">项目类型</div>
              <div class="cont-data" >
                <a @click="openProjType">{{ iegAmount(Math.trunc(model.projTypeNum), 'total') }}</a>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index ">
          <img src="~@/assets/img_2.png" style="width: 30px;height: 30px;float: left;position:absolute;margin-left: 31px;margin-top: 13px">
          <div class="right-content blue-number">
            <div style="display: inline-block;">
              <div class="card-title-font">地区</div>
              <div class="cont-data">
                <a @click="openProjArea">{{ iegAmount(Math.trunc(model.projAreaNum),'total') }}</a>
              </div>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card class="card-main-index ">
          <img src="~@/assets/img_3.png" style="width: 30px;height: 30px;float: left;position:absolute;margin-left: 31px;margin-top: 13px">
          <div class="right-content green-number">
            <div style="display: inline-block;">
              <div class="card-title-font">项目数量</div>
              <div class="cont-data">{{ iegAmount(Math.trunc(model.projNum),'total') }}</div>
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24">
        <a-card>
          <img src="~@/assets/img.png" style="margin-left: 13%">
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24" style="margin-top: 24px">

      <a-col :sm="24" :md="12" :xl="24" :style="{ marginBottom: '24px' }">
        <a-card style="max-height: 420px;padding-top: 1.2rem;">
<!--          <div class="right-content">-->
<!--            <div style="display: inline-block;">-->
              <div class="card-title" style="margin-top: -30px">
                项目清单
              </div>
              <a-table
                style="clear:both;margin-top: -40px"
                ref="table"
                size="middle"
                bordered
                rowKey="id"
                :scroll="{x:100,y:270}"
                :columns="columns"
                :dataSource="dataSource"
                :pagination="ipagination"
                :customRow="customRow"
                @change="handleTableChange">
              </a-table>
<!--            </div>-->
<!--          </div>-->
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="24" v-if="queryParam.projId != null && queryParam.projId != '' && queryParam.projId != undefined">
      <a-col :span="12">
        <a-card style="padding: 10px 20px 10px 20px;height: 288px" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <a-row>
            <a-col :span="16">
              <div class="card-title">
                子项目进度
              </div>
            </a-col>
            <!-- <a-col :span="8">
                <j-dict-select-tag v-model="queryParam.projId" placeholder="请选择项目"
                                   style="width: 220px; float: right;margin-right: 10px; margin-top: 10px;"
                                   dictCode="proj_base,proj_name,id,del_flag = '0' order by create_time desc"
                                   @change="searchQuery" />
            </a-col> -->
            <a-col :span="8">
              <!--              <j-dict-select-tag v-model="queryParam.model" placeholder="请选择项目子项"-->
              <!--                                 style="width: 220px; float: right;margin-right: 10px; margin-top: 10px;"-->
              <!--                                 dictCode="model"-->
              <!--                                 @change="searchQuery" />-->
              <a-select  v-model="queryParam.model"
                         placeholder="请选择项目子项" :allowClear="allowClear"  style="width: 220px; float: right;margin-right: 10px; margin-top: 10px;" @change="fetchModel">
                <a-select-option v-for="(item, key) in dictOptions" :key="item.value" :value="item.value">
                  {{ item.text || item.label }}
                </a-select-option>
              </a-select>
            </a-col>
          </a-row>
          <a-row>
            <a-carousel arrows class="new-card-main">
              <div
                slot="prevArrow"
                slot-scope="props"
                class="custom-slick-arrow"
                style="left: 10px;zIndex: 1"
              >
                <a-icon type="left-circle new22" style="color: black" />
              </div>
              <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
                <a-icon type="right-circle new22" style="color: black" />
              </div>
              <div style="line-height: 30px; background-color: #FFF!important;" v-if="childList != null && childList.length > 0" v-for="(item,index) in childList">
                <span class="card-title-font" style=" width: 100%;padding-left: 20px;text-align: left;display: block;line-height: 30px;margin-bottom: 20px;">
					        {{item.text}}
                </span>
                <div style="  font-size: 16px;    text-align: left;    padding-left: 50px; height: 40px;" class="item-concel-iii">
                  产能进度(%):<a-progress :percent="item.prodCapacity" style="width: 50%;" strokeColor="#8A38F5"/>
                </div>
                <div style="  font-size: 16px;    text-align: left;    padding-left: 50px; height: 40px;" class="item-concel-iii">
                  形象进度(%):<a-progress :percent="item.imageCapacity" style="width: 50%" strokeColor="#00BBFF"/>
                </div>
                <div style="  font-size: 16px;    text-align: left;    padding-left: 50px; height: 40px;" class="item-concel-iii">
                  资金进度(%):<a-progress :percent="item.moneyCapacity" style="width: 50%;height: 10px" strokeColor="#00B578"/>
                </div>
              </div>
            </a-carousel>
          </a-row>
        </a-card>
      </a-col>
      <a-col :span="12" v-if="queryParam.projId != null && queryParam.projId != '' && queryParam.projId != undefined">
        <a-card style="padding: 10px 20px 30px 30px;" :loading="loading" :bordered="false" :body-style="{padding: '0'}">
          <a-col :span="12">
            <a-row>
              <a-col :span="24">
                <div class="card-title" style="width: 100%;">
                  设备到场数量统计(台套数)
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <div style="padding-left: 2rem;">
                  <newRateChart2 :percentNum="model.percent" :title="'设备到场数量统计'" ref="chart2"></newRateChart2>
                </div>
              </a-col>
            </a-row>
          </a-col>
          <a-col :span="12">
            <a-row>
              <a-col :span="24">
                <div class="card-title" style="width: 100%;">
                  设备签署合同数量统计(台套数)
                </div>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <div style="padding-left: 2rem;">
                  <newRateChart2 :percentNum="model.cpercent" :title="'设备签署合同数量统计'" ref="chart3"></newRateChart2>
                </div>
              </a-col>
            </a-row>
          </a-col>
        </a-card>
      </a-col>

    </a-row>

    <a-row style="margin-top: 1rem;">

    </a-row>

    <a-modal
      title="项目地区"
      :width="500"
      :visible="visible1"
      @cancel="close1">
      <div v-for="(item,index) in projAreaList">
        <h2>
          <span v-if="item.abbr != null && item.abbr != '' && item.abbr != undefined">
            {{item.abbr}}-
          </span>
          {{item.subject}}:{{item.num}}个
        </h2>
      </div>
      <template slot="footer">
        <a-button @click="close1" type="primary">取消</a-button>
      </template>
    </a-modal>

    <a-modal
      title="项目类型"
      :width="400"
      :visible="visible"
      @cancel="close">
      <div v-for="(item,index) in projTypeList">
          <h2>{{item.projType}}:{{item.num}}个</h2>
      </div>
      <template slot="footer">
        <a-button @click="close" type="primary">取消</a-button>
      </template>
    </a-modal>

    <a-modal
      :title="title"
      :width="400"
      :visible="visible2"
      @cancel="close2">
      <div v-for="(item,index) in payAmountList">
        <h2>{{item.projType}}:{{ iegAmount(Math.trunc(item.payAmount),'total') }}</h2>
      </div>
      <template slot="footer">
        <a-button @click="close2" type="primary">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
/* import Vue from 'vue'
import echarts from 'echarts' */
import Bar from '@/components/chart/Bar'
import newRateChart from '@/components/chart/newRateChart'
import newRateChart2 from '@/components/chart/newRateChart2'
import { getLoginfo, getVisitInfo } from '@/api/api'
import { getAction } from '@api/manage'
import {
  iegAmount, isNullOrEmpty
} from '@/utils/util'

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}
const barData = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}
export default {
  name: 'IndexChart',
  components: {
    Bar,
    newRateChart,
    newRateChart2
  },
  data() {
    return {
      title:'',
      payAmountList:[],
      visible2:false,
      isorter:{
        column: 'projCode',
        order: 'asc',
      },
      visible1:false,
      projAreaList:[],
      projTypeList:[],
      visible:false,
      ipagination:{
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10','20', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + "-" + range[1] + " 共" + total + "条"
        },
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0
      },
      dataSource:[],
      columns: [
        {
          title: '序号',
          dataIndex: '',
          key:'rowIndex',
          width:100,
          align:"center",
          customRender:function (t,r,index) {
            return parseInt(index)+1;
          }
        },
        {
          title:'项目名称',
          align:"center",
          dataIndex: 'projName',
          width:430,
        },
        {
          title:'项目类型',
          align:"center",
          dataIndex: 'projType_dictText',
          width:220,
        },
        {
          title:'主体',
          align:"center",
          dataIndex: 'subject_dictText',
          width:220,
        },
        {
          title:'项目总投',
          dataIndex: 'budgetAmount',
          width:220,
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';

            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          },
        },
        {
          title: '合同总额',
          dataIndex: 'usedAmount',
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';

            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          },
          width: 220,
        },
        {
          title: '支出金额',
          dataIndex: 'payAmount',
          customRender:function (t,r,index) {
            let icon = "";
            icon = '¥';

            const obj = {
              children: icon + iegAmount(Math.trunc(t),'total'),
              attrs: {},
            };
            obj.attrs.align = 'right';//控制表体内容居右
            return obj;
          },
          width: 220,
        },
      ],
      dictOptions:[],
      allowClear:true,
      iegAmount,
      childList:[],
      capacityList: [],
      queryParam: {
        projId: undefined,
        model:undefined
      },
      model: {
        budgetAmount: 0,
        contractAmountTaxLocal: 0,
        payAmount: 0,
        invoiceAmount:0,
        projAreaNum:0,
        projTypeNum:0,
        projNum:0
      },
      loading: true,
      center: null,
      rankList,
      barData,
      loginfo: {},
      visitFields: ['ip', 'visit'],
      visitInfo: [],
      countSource: [
        { item: '示例一', count: 80 },
        { item: '示例二', count: 21 }
      ],
      registerTypeList: [{
        text: '采购申请'
      }, {
        text: '采购审批'
      }, {
        text: '发起招标'
      }, {
        text: '询价比价'
      }],
      indicator: <a-icon type="loading" style="font-size: 24px" spin />
    }
  },
  watch : {
    queryParam: {
      handler(newObj, oldName) {
        if(isNullOrEmpty(newObj.projId)){
          newObj.projId = undefined;
          this.queryParam.projId = undefined;
        }
        console.log("============",newObj)
      },
      immediate: true,
      deep: true
    }
  },
  created() {
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
    this.initLogInfo()
    //项目数量
    this.fetchProjNum();
    //项目总投
    this.fetchProjectAmount();
    //项目已投
    this.fetchContractByProjId();
    //支出金额
    this.fetchPayAmountByProjId();
    //开票金额
    this.fetchInvoiceByProjId();
    //项目总产能
    // this.fetchCapacity();
    //合同数量统计
    this.fetchContractQty();
    //设备到厂数量统计
    this.fetchArrivalQty();
    //子项目数量
    this.fetchChildProgress();
    //项目清单
    this.loadData();
    setTimeout(() => {
      this.$refs.chart2.initData(this.model.percent);
      this.$refs.chart3.initData(this.model.cpercent);
    }, 1000)
  },
  mounted() {

  },
  methods: {
    jumpPlan(){
      this.$router.push({
        path: '/pay/PurPayPlanList',
        query:{}
      })
    },
    jumpContract(){
      this.$router.push({
        path: '/contract/BasSupplierContractList',
        query:{}
      })
    },
    jumpProj(){
      this.$router.push({
        path: '/project/ProjBaseList',
        query:{}
      })
    },
    close2(){
      this.visible2 = false;
    },
    openBudgetAmount(){
      this.title = "项目总投";
      this.payAmountList = [];
      //获取项目类型
      let url = '/srm/projBase/fetchProjectAmountByType'
      let param = {
        id:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        this.payAmountList = res.result;
      })
      this.visible2 = true;
    },
    openContractAmount(){
      this.title = "合同总额";
      this.payAmountList = [];
      //获取项目类型
      let url = '/srm/contractBase/fetchContractByProjType'
      let param = {
        id:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        this.payAmountList = res.result;
      })
      this.visible2 = true;
    },
    openPayAmount(){
      this.title = "支出总额";
      this.payAmountList = [];
      //获取项目类型
      let url = "/srm/purPayPlan/fetchProjTypeAmountByProjId";
      let param = {
        id:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        this.payAmountList = res.result;
      })
      this.visible2 = true;
    },
    customRow(record, index) {
      return {
        style: {
          // 行背景色
          'background-color': index % 2 == 0 ? '#EEEEEE' : '#FFFFFF',
          height:'90px'
        }
      }
    },
    fetchModel(){
      this.fetchContractQty();
      this.fetchArrivalQty();
      this.fetchChildProgress();
      setTimeout(() => {
        this.$refs.chart2.initData(this.model.percent);
        this.$refs.chart3.initData(this.model.cpercent);
      }, 800)
    },
    close1(){
      this.visible1 = false;
    },
    openProjArea(){
      this.projAreaList = [];
      //获取项目类型
      let url = "/srm/projBase/fetchProjArea";
      let param = {
        id:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        this.projAreaList = res.result;
      })
      this.visible1 = true;
    },
    close(){
      this.visible = false;
    },
    openProjType(){
      this.projTypeList = [];
      //获取项目类型
      let url = "/srm/projBase/fetchProjType";
      let param = {
        id:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        this.projTypeList = res.result;
      })
      this.visible = true;
    },
    handleTableChange(pagination, filters, sorter) {
      this.ipagination = pagination;
      this.loadData();
    },
    loadData(arg){
      this.dataSource = [];
      let url = "/srm/projBase/list";
      //加载数据 若传入参数1则加载第一页的内容
      if (arg === 1) {
        this.ipagination.current = 1;
      }
      var params = {};
      params.pageNo = this.ipagination.current;
      params.pageSize = this.ipagination.pageSize;
      params.id = this.queryParam.projId;
      params.column = 'projCode';
      params.order = 'asc';
      getAction(url, params).then((res) => {
        if (res.success) {
          //update-begin---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
          this.dataSource = res.result.records||res.result;
          if(res.result.total)
          {
            this.ipagination.total = res.result.total;
          }else{
            this.ipagination.total = 0;
          }
          //update-end---author:zhangyafei    Date:20201118  for：适配不分页的数据列表------------
        }else{
          this.$message.warning(res.message)
        }
      }).finally(() => {
        this.loading = false
      })
    },
    fetchInvoiceByProjId(){
      let url = "/srm/purchasePayInovice/fetchInvoiceByProjId";
      let param = {
        projectId: this.queryParam.projId
      }
      getAction(url,param).then(res => {
        if(res.result != null && res.result.length > 0){
          this.model.invoiceAmount = res.result[0].invoiceAmountTaxLocal;
        }else{
          this.model.invoiceAmount = 0;
        }
        this.$forceUpdate();
      })
    },
    fetchModelByProjId(){
      this.dictOptions = [];
      this.queryParam.model = undefined;
      let url = "/srm/projBase/fetchModelByProjId";
      let param = {
        id:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        this.dictOptions = res.result;
      })
    },
    searchQuery(val,options) {
      this.queryParam.projName = null;
      if(options != null){
        options.filter(item => {
          if(val == item.value){
            this.queryParam.projName = item.label || item.text;
          }
        })
      }
      //加载项目子项
      this.fetchModelByProjId();
      //项目数、类型、地区统计
      this.fetchProjNum();
      //项目总投
      this.fetchProjectAmount();
      //项目已投
      this.fetchContractByProjId();
      //支出金额
      this.fetchPayAmountByProjId();
      //开票金额
      this.fetchInvoiceByProjId();
      //项目总产能
      // this.fetchCapacity();
      //设备到厂数量统计
      this.fetchArrivalQty();
      //
      this.fetchContractQty();
      //子项目数量
      this.fetchChildProgress();

      this.loadData();

      setTimeout(() => {
        this.$refs.chart2.initData(this.model.percent);
        this.$refs.chart3.initData(this.model.cpercent);
      }, 1000)

    },
    //子项目数量
    fetchChildProgress(){
      this.childList = [];
      let url = "/srm/projBase/fetchChildProgress";
      let param = {
        model:this.queryParam.model,
        projectId:this.queryParam.projId
      }
      getAction(url,param).then(res => {
        let data = res.result;
        this.childList = data;
        this.$forceUpdate();
      })
    },
    fetchContractQty(){
      this.model.cpercent = 0;
      let url = '/srm/contractBase/fetchContractQty'
      let param = {
        projectId: this.queryParam.projId,
        model:this.queryParam.model
      }
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.cpercent = res.result.qty
          this.$forceUpdate()
        }
      })
    },
    //设备到厂数量统计
    fetchArrivalQty() {
      this.model.percent = 0;
      let url = '/srm/stkIoBill/fetchArrivalQty'
      let param = {
        projectId: this.queryParam.projId,
        model:this.queryParam.model
      }
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.percent = res.result.qty
          this.$forceUpdate()
        }
      })
    },
    //项目总产能
    fetchCapacity() {
      this.capacityList = [];
      let url = '/srm/projBase/fetchCapacity'
      let param = {
        id: this.queryParam.projId
      }
      getAction(url, param).then(res => {
        if (res != null) {
          this.capacityList = res
          this.$forceUpdate()
        }
      })
    },
    //项目数量统计
    fetchProjNum(){
      this.model.projAreaNum = 0;
      this.model.projNum = 0;
      this.model.projTypeNum = 0;
      let url = '/srm/projBase/fetchProjNum'
      let param = {id: this.queryParam.projId}
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.projAreaNum = res.result.projAreaNum;
          this.model.projNum = res.result.projNum;
          this.model.projTypeNum = res.result.projTypeNum;
          this.$forceUpdate()
        }
      })
    },
    //项目总投
    fetchProjectAmount() {
      this.model.budgetAmount = 0;
      let url = '/srm/projBase/fetchProjectAmount'
      let param = {id: this.queryParam.projId}
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.budgetAmount = res.result.budgetAmount
          this.$forceUpdate()
        }
      })
    },
    //项目已投
    fetchContractByProjId() {
      this.model.contractAmountTaxLocal = 0;
      let url = '/srm/contractBase/fetchContractByProjId'
      let param = {projectId: this.queryParam.projId}
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.contractAmountTaxLocal = res.result.contractAmountTaxLocal
          this.$forceUpdate()
        }
      })
    },
    //支出金额
    fetchPayAmountByProjId() {
      this.model.payAmount = 0;
      let url = '/srm/purPayPlan/fetchPayAmountByProjId'
      let param = {projectId: this.queryParam.projId}
      getAction(url, param).then(res => {
        if (res.result != null) {
          this.model.payAmount = res.result.payAmountCope
          this.$forceUpdate()
        }
      })
    },

    drawChart() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('main'))
      // 指定图表的配置项和数据
      let option = {
        series: [
          {
            name: '',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 1048, name: '支持率', itemStyle: { color: '#3662EC' } },
              { value: 735, name: '', itemStyle: { color: '#E0EAFF' } }
            ]
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    initLogInfo() {
      getLoginfo(null).then((res) => {
        if (res.success) {
          Object.keys(res.result).forEach(key => {
            res.result[key] = res.result[key] + ''
          })
          this.loginfo = res.result
        }
      })
      getVisitInfo().then(res => {
        if (res.success) {
          this.visitInfo = res.result
        }
      })
    }
  }
}
</script>
<style>
.new-card-main .ant-progress.ant-progress-line{
		margin-left: 30px;
	}
	.new-card-main .ant-carousel .slick-initialized .slick-slide {
		background: #FFF!important;
	}
	.item-concel-iii{

	}
	.item-concel-iii .ant-progress .ant-progress-outer .ant-progress-inner{
		height: 20px!important;
		border-radius: 0!important;
	}
	.item-concel-iii .ant-progress .ant-progress-outer .ant-progress-inner .ant-progress-bg{
		height: 20px!important;
		border-radius: 0!important;
	}
	.new-card-main .ant-progress.ant-progress-line{
		margin-left: 30px;
	}
	.new-card-main .ant-carousel .slick-initialized .slick-slide {
		background: #FFF!important;
	}
.point-div {
  line-height: 50px;
}

.orange-point::before {
  content: " ";
  width: 8px;
  height: 8px;
  background: orange;
  border-radius: 4px;
  display: inline-block;
}

.bule-point::before {
  content: " ";
  width: 8px;
  height: 8px;
  background: #3662EC;
  border-radius: 4px;
  display: inline-block;
}

.gray-point::before {
  content: " ";
  width: 8px;
  height: 8px;
  background: #D8D8D8;
  border-radius: 4px;
  display: inline-block;
}

/* #E8EAF2 */
</style>
<style lang="less" scoped>
.circle-cust {
  position: relative;
  top: 28px;
  left: -100%;
}

.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

/* 首页访问量统计 */
.head-info {
  position: relative;
  text-align: left;
  padding: 0 32px 0 0;
  min-width: 125px;

  &.center {
    text-align: center;
    padding: 0 32px;
  }

  span {
    color: rgba(0, 0, 0, .45);
    display: inline-block;
    font-size: .95rem;
    line-height: 42px;
    margin-bottom: 4px;
  }

  p {
    line-height: 42px;
    margin: 0;

    a {
      font-weight: 600;
      font-size: 1rem;
    }
  }
}

</style>
<style scoped>
/* For demo */
.ant-carousel >>> .slick-slide {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #fafafa;
  overflow: hidden;
}

.ant-carousel >>> .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}

.ant-carousel >>> .custom-slick-arrow:before {
  display: none;
}

.ant-carousel >>> .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel >>> .slick-slide h3 {
  color: #fff;
}
.circle{
  border-radius: 100%;
  overflow: hidden;
  width: 100px;
  height: 80px;
}
.circle img{
  height: 100%;
}
.ant-table-striped :deep(.table-striped) td {
  background-color: #fafafa;
}
</style>