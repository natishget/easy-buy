// src/auth/strategies/jwt.strategy.ts
// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';

// const JWT_SECRET = process.env.JWT_Secret_key


// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(private configService: ConfigService) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_Secret_key') || "easybuy_secret",
//     });
//   }

//   async validate(payload: any) {
//     console.log('JWT Payload:', payload);
//     return { userId: payload.sub, email: payload.email };
//   }
// }

// src/auth/strategies/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // ✅ make sure it's extracting from the right place
      ignoreExpiration: false,
      secretOrKey: 'easybuy_secret', // ✅ or your actual secret
    });
  }

  async validate(payload: any) {
    console.log('JWT Payload:', payload); // 🟢 Should log here
    return payload; // This gets attached to `req.user`
  }
}

