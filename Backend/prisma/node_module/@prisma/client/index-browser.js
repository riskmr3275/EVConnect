
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  password: 'password',
  accountType: 'accountType',
  image: 'image',
  gender: 'gender',
  dateOfBirth: 'dateOfBirth',
  about: 'about',
  contactNumber: 'contactNumber',
  token: 'token',
  tokenExpires: 'tokenExpires',
  resetPasswordExpires: 'resetPasswordExpires',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserDetailsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  address: 'address',
  preferences: 'preferences',
  city: 'city',
  state: 'state',
  zipCode: 'zipCode',
  createdAt: 'createdAt'
};

exports.Prisma.OwnerDetailsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  companyName: 'companyName',
  companyRegNo: 'companyRegNo',
  companyDocs: 'companyDocs',
  address: 'address',
  contactEmail: 'contactEmail',
  createdAt: 'createdAt'
};

exports.Prisma.AdminDetailsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  employeeId: 'employeeId',
  department: 'department',
  accessLevel: 'accessLevel',
  assignedZone: 'assignedZone',
  createdAt: 'createdAt'
};

exports.Prisma.StationMasterDetailsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stationId: 'stationId',
  ownerId: 'ownerId',
  shift: 'shift',
  experience: 'experience',
  certification: 'certification',
  createdAt: 'createdAt'
};

exports.Prisma.EVScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  brand: 'brand',
  model: 'model',
  licensePlate: 'licensePlate',
  batteryCapacity: 'batteryCapacity',
  batteryPercentage: 'batteryPercentage',
  isDefault: 'isDefault',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.StationScalarFieldEnum = {
  id: 'id',
  name: 'name',
  companyName: 'companyName',
  ownerType: 'ownerType',
  ownerId: 'ownerId',
  address: 'address',
  latitude: 'latitude',
  longitude: 'longitude',
  totalSlots: 'totalSlots',
  availableSlots: 'availableSlots',
  contact: 'contact',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BookingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stationId: 'stationId',
  evId: 'evId',
  startTime: 'startTime',
  endTime: 'endTime',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.TransactionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  amount: 'amount',
  type: 'type',
  status: 'status',
  bookingId: 'bookingId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ChargingSlotScalarFieldEnum = {
  id: 'id',
  stationId: 'stationId',
  isOccupied: 'isOccupied',
  powerLevel: 'powerLevel',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ReviewScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stationId: 'stationId',
  rating: 'rating',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.ChargingHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  stationId: 'stationId',
  bookingId: 'bookingId',
  evId: 'evId',
  energyUsed: 'energyUsed',
  cost: 'cost',
  duration: 'duration',
  createdAt: 'createdAt'
};

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  message: 'message',
  type: 'type',
  isRead: 'isRead',
  createdAt: 'createdAt'
};

exports.Prisma.OTPScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  otp: 'otp',
  createdAt: 'createdAt',
  expiresAt: 'expiresAt',
  isUsed: 'isUsed'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.AccountType = exports.$Enums.AccountType = {
  USER: 'USER',
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  STATIONMASTER: 'STATIONMASTER'
};

exports.OwnerType = exports.$Enums.OwnerType = {
  COMPANY: 'COMPANY',
  INDIVIDUAL: 'INDIVIDUAL'
};

exports.BookingStatus = exports.$Enums.BookingStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED'
};

exports.TransactionType = exports.$Enums.TransactionType = {
  PAYMENT: 'PAYMENT',
  PENALTY: 'PENALTY',
  REFUND: 'REFUND'
};

exports.TransactionStatus = exports.$Enums.TransactionStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.SlotType = exports.$Enums.SlotType = {
  AC: 'AC',
  DC: 'DC',
  FAST: 'FAST'
};

exports.NotificationType = exports.$Enums.NotificationType = {
  BOOKING_CONFIRMATION: 'BOOKING_CONFIRMATION',
  BOOKING_CANCELLATION: 'BOOKING_CANCELLATION',
  PAYMENT_SUCCESS: 'PAYMENT_SUCCESS',
  PENALTY_APPLIED: 'PENALTY_APPLIED'
};

exports.Prisma.ModelName = {
  User: 'User',
  UserDetails: 'UserDetails',
  OwnerDetails: 'OwnerDetails',
  AdminDetails: 'AdminDetails',
  StationMasterDetails: 'StationMasterDetails',
  EV: 'EV',
  Station: 'Station',
  Booking: 'Booking',
  Transaction: 'Transaction',
  ChargingSlot: 'ChargingSlot',
  Review: 'Review',
  ChargingHistory: 'ChargingHistory',
  Notification: 'Notification',
  OTP: 'OTP'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
