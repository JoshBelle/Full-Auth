'use client'
import * as z from 'zod'
import CardWrapper from './card-wrapper'
import FormError from '../form-error'
import FormSuccess from '../form-success'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginSchema } from '@/schemas'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { login } from '@/actions/login'
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form'

export default function LoginForm() {
  const searchParams  = useSearchParams()
  const urlError  =  searchParams.get('error') === 'OAuthAccountNotLinked'
    ? 'Email already in use with different provider!'
    : ''

  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values:z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values)
        .then((data) => {
          setError(data?.error)
          setSuccess(data?.success)
        })
    })
  }
  return (
    <CardWrapper
        headerLabel='Welcome back!'
        backButtonLabel="don't have an account?"
        backButtonHref='/auth/register'
        showSocial
    >
      <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        disabled={isPending}
                        placeholder='john.snow@example.com'
                        type='email'
                      />
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        disabled={isPending}
                        placeholder='******'
                        type='password'
                      />
                    </FormControl>
                    <Button
                      size='sm'
                      variant='link'
                      asChild
                      className='px-0 font-normal'
                    >
                      <Link href='/auth/reset'>
                        Forgot password?
                      </Link>
                    </Button>
                    <FormMessage/>
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error || urlError} />
            <FormSuccess message={success} />
            <Button
              disabled={isPending}
              type='submit'
              className='w-full'
            >Login</Button>
          </form>
      </Form>
    </CardWrapper>
  )
}
