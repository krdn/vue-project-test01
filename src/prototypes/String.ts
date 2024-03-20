interface String {
  encodeHTML(): string
  decodeHTML(): string
  isValidPassword(): boolean
  isValidUserId(): boolean
  isValidPhoneNumber(): boolean
  isValidEmail(): boolean
}

String.prototype.encodeHTML = function (): string {
  return this.replace(/./gm, (str) => {
    const match = str.match(/[a-z0-9\s]+/i)

    if (match && match.length > 0) {
      return str
    }

    return `&#${str.charCodeAt(0)};`
  })
}

String.prototype.decodeHTML = function (): string {
  return this.replace(/&#\d+;/gm, (str) => {
    const match = str.match(/\d+/gm)

    if (match && match.length > 0) {
      return String.fromCharCode(parseInt(match[0]))
    }

    return str
  })
}

String.prototype.isValidPassword = function (): boolean {
  const regex = new RegExp(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[`~!@#\$%\^\&\*()\-_=\+;:'",.\/\\|]).{8,15}/,
    'g'
  )
  const characters = this as string

  return regex.test(characters)
}

String.prototype.isValidUserId = function (): boolean {
  const regex = new RegExp(/^[a-zA-Z]{4,15}$/)
  const characters = this as string

  return regex.test(characters)
}

String.prototype.isValidPhoneNumber = function (): boolean {
  const regex = new RegExp(/^01[0-9]-[0-9]{3,4}-[0-9]{4}$/)
  const characters = this as string

  return regex.test(characters)
}

String.prototype.isValidEmail = function (): boolean {
  const regex = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/)
  const characters = this as string

  return regex.test(characters)
}
