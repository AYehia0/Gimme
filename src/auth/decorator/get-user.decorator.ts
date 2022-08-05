import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// a decorator to extract the user from the request, doesn't depend on the framework you're using : express, fast..
export const GetUser = createParamDecorator(
    (data: string | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest()

        // return only specific parts of the user
        if (data)
            return request.user[data]

        return request.user
    },
)
