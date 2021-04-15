import {
  validateColor
} from '@/utils/validate'
export function avatar() {
  if (!this || !this.data.avatar || validateColor(this.data.avatar)) {
    return false
  } else {
    return this.baseUrl + 'service-file/FileToken/jpg?fileToken=' + this.data.avatar
  }
}
export function avatarName() {
  if (!this) return ''
  const name = this.name || 'userFullname'
  if (this.data && this.data[name]) {
    const l = this.data[name].length
    if (l > 2) {
      return this.data[name].toUpperCase().substring(0, 1)
    } else {
      return this.data[name].toUpperCase().substring(l - 1)
    }
  }
}
export const avatarColor = {
  male: ['#77DBCE', '#12B199', '#7CD5EB', '#14AAD5', '#79AB01', '#AED749', '#51AFFF', '#0681E8', '#739EFF', '#415DE9'],
  female: ['#F15F7A', '#FF94A8', '#FFB496', '#F6895E', '#F75E45', '#E43030', '#FFAE00', '#FFD200', '#D79AED', '#B352D7']
}
