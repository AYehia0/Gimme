import { ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus } from '@nestjs/common'

type response =  {
    status: number
    message: string
    data: any
}

@Catch()
export class ErrorFilter implements ExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    let response = host.switchToHttp().getResponse()
    let request = host.switchToHttp().getRequest()
    let status = (error instanceof HttpException) ? error.getStatus(): HttpStatus.INTERNAL_SERVER_ERROR

    const resToSend: response = {
        status: status,
        message: error.message,
        data: []
    }

    if (process.env.NODE_ENV === 'dev') {
      return response.send(resToSend)
    }
    else if (process.env.NODE_ENV === 'test') {
      console.error(error.stack)
      return response.send(resToSend)
    }
    else {
      let message = error.message
      return response.status(status).send({status: resToSend.status}) 
    } 
  }
}
