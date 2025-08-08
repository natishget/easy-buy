import { IsNotEmpty } from "class-validator";

export class CreateOrderDto {

    @IsNotEmpty()
    quantity!: number

    @IsNotEmpty()
    totalPrice!: number

    @IsNotEmpty()
    productId!: number

    @IsNotEmpty()
    buyerId!: number
}
