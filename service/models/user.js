const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email!',
      isAsync: false
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v.length >= 6;
      },
      message: '{VALUE} need length > 5 symbols!'
    },
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  online: {
    type: Boolean,
    required: true,
    default: false
  },
  info: {
    phone: {
      type: String,
      required: false,
      validate: {
        validator: function(phone_number) {
          return /^((\+|38|0)+([0-9]){9})$/m.test(phone_number);
        },
        message: '{VALUE} is not a valid phone number!'
      }
    },
    name: {
      type: String,
      required: true
    },
    photo: {
      type: String,
      required: false
    },
    salary: {
      type: Number,
      required: false,
      validate: {
        validator: function(v) {
          return v >= 0;
        },
        message: 'Salary cannot be < 0!'
      }
    },
    post: {
      type: String,
      required: false
    },
    chats: [{
      type: mongoose.Schema.Types.ObjectId
    }],
    status: {
      weeks: [{
        updated: Date,
        working_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        },
        vacation_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        },
        truancy_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        },
        holiday_hours: {
          type: Number,
          required: false,
          validate: {
            validator: function(v) {
              return v >= 0;
            },
            message: 'Working hours cannot be < 0!'
          }
        }
      }],
      work_days: [{
        type: Number
      }],
      work_times: [{
        start: {
          type: String,
          required: true,
          validate: {
            validator: function(time) {
              return /^(?:[01]\d|2[0123]):(?:[012345]\d)$/m.test(time);
            },
            message: '{VALUE} is wrong time format!'
          }
        },
        end: {
          type: String,
          required: true,
          validate: {
            validator: function(time) {
              return /^(?:[01]\d|2[0123]):(?:[012345]\d)$/m.test(time);
            },
            message: '{VALUE} is wrong time format!'
          }
        }
      }]
    }
  },
}, { timestamps: true });

UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password')) {return next()};
    bcrypt.hash(user.password,10).then((hashedPassword) => {
        user.password = hashedPassword;
        next();
    })
}, function (err) {
    next(err)
})

// UserSchema.methods.comparePassword = function(candidatePassword, next) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) return next(err);
//     next(null, isMatch)
//   });
// }

UserSchema.methods.comparePassword = bcrypt.compareSync;

const User = mongoose.model("User", UserSchema);

module.exports = User;
