import { getFiles, getFile, delFile } from './api'
import {uuid} from "@/utils/util";

export default {
  computed: {
    // LANG() {
    //   return deepmerge(this.lan() || {}, this.$store.state[LANG][this.$options.name] || {}, { clone: true })  //注册模块的入口文件中，覆盖全局LANG,指向当前模块
    // }
  },
  methods: {
    /**
     * 表单加载后获取初始化附件数据。
     * @param groupToken g9s
     * @returns {{data: {g9s: *}, url: string, fileList: []}}
     */
    getInitFileData(groupToken) {
      let resFileData = {
        url: process.env.VUE_APP_UPLOAD_API,
        data: {g9s: groupToken},
        fileList: [],
        uploadFiles: [],
        removeFiles: []
      }
      if (groupToken && groupToken.length > 0) {
        // 有附件信息自然用已有的附件存的g9s；否则只能去生成一个。
        getFiles({
          g9s: [groupToken]
        }).then(res => {
          if (res && res.data && res.data.length > 0) {
            for (const file of res.data) {
              resFileData.fileList.push({
                name: file.fileName,
                size: file.size,
                f8s: file.fileToken
              });
            }
          }
        }).catch(e => {
          this.$message({type: 'error', message: '获取文件失败：' + e})
        });
      } else {
        groupToken = uuid(32, 16);
      }
      resFileData.data.g9s = groupToken;
      return resFileData;
    },
    getFileList(fileData) {
      let res = [];
      fileData.fileList.forEach(file => res.push(file));
      fileData.uploadFiles.forEach(file => res.push(file));
      return res.filter(file1 => !fileData.removeFiles.some(file2 => file1.uid === file2.uid));
    },
    flushFileData() {},
    /**
     * 添加文件、上传成功和上传失败时都会被调用。
     * @param file
     * @param fileList
     */
    onUploadChange(file, fileList) {
      // 添加文件时将文件放入上传列表中。
      if (!file.response) this.fileData.uploadFiles.push(file);
    },
    /**
     * 文件列表移除文件时的钩子。
     * @param file
     * @param fileList
     */
    onUploadRemove(file, fileList) {
      // 移除文件时将文件放入删除列表中。
      this.fileData.removeFiles.push(file);
    },
    // 上传前校验
    beforeUpload(file) {
      console.log('uploadFileLengthCheck', this.fileData.fileList)
      if (this.fileData.fileList.length === 5) {
        this.$message({type: 'fail', message: '上传附件数量超过限制，仅限上传5个附件'})
        return false
      }
      let acceptFileTypes = ['doc', 'docx', 'xls', 'pdf', 'rar', 'zip', 'png', 'jpg', 'jpeg',]
      let fileType = file.type.split('/')
      let fileTypeJunior = file.name.split('.')
      let index = acceptFileTypes.indexOf(fileType[1])
      let indexJunior = acceptFileTypes.indexOf(fileTypeJunior[fileTypeJunior.length - 1])
      // console.log('fileType', file, fileType)
      // console.log('index', index)
      // console.log('indexJunior', indexJunior)
      if (index === -1 && indexJunior === -1) {
        this.$message({type: 'fail', message: '文件格式不符, 仅支持上传doc、docx、xls、pdf、rar、zip、png、jpg格式文件'})
        return false
      }
    },
    // 删除处理函数
    handleRemove(file, fileList, formName, formMark) {
      // console.log('handleRemovemix', file, formMark)
      let f8s = file.response?.data?.fileToken? file.response.data.fileToken: ''
      // console.log('f8s', f8s)
      if (f8s && f8s.length > 0) {
        delFile({
          f8s: [f8s]
        }).then(res => {
          if (res.code === 8000000) {
            this.$message({type: 'success', message: '已删除文件'})
            let index = -1
            for (let i = 0; i < this.fileData.fileList.length; i++) {
              let fileData = this.fileData.fileList[i]
              if (f8s === fileData.response.data.fileToken) {
                index = i
              }
            }
            this.fileData.fileList.splice(index, 1)
            if (this.fileData.fileList.length === 0 && formName) {
              // console.log('warn')
              this[formName][formMark] = ''
            }
          }
        }).catch(e => {
          this.$message({type: 'error', message: '删除文件失败：' + e})
        })
      }
    },
  },
  created() {
  }
}