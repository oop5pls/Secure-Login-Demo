import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class HashFunction {
    public constructor(input1: string, input2: string) {

    }

    private createHash(input1: string, input2: string) {
        const h1 = this.ascii_sum(input1);
        const h2 = this.ascii_sum(input2);


    }
    private ascii_sum(input: string): number {
        let sum = 0;

        for (const char of input) {
            sum += char.charCodeAt(0);
        }

        return sum;
    }
}