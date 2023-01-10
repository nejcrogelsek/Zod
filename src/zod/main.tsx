/*
    Copy and Find:
        Basic types
        Schema .passthrough(), .strict()
        Array & Tuple
        Union, Discriminated Union
        better performance gains
        Record Type
        Map Type
        Set Type
        Promise Type
*/

import { z } from 'zod'
import { fromZodError } from 'zod-validation-error'

// Basic types

const UserSchema = z.object({
    username: z.string(),
    age: z.number()
})
    .pick({ username: true }) // Only pick username from UserSchema
//.omit({ age: true }) // Omit/Remove values from UserSchema
//.partial() // Makes keys optional
//.deepPartial() // Makes keys & nested keys optional
//.extend({ name: z.string() }) // Add keys to the UserSchema
//.merge(UserSchema2) // Merge/Add schema to UserSchema

type User = z.infer<typeof UserSchema>

const user: User = { username: 'John' }
const user2 = { username: 1 }

console.log('Log-1: parse', UserSchema.parse(user)) // Return: user object
console.log('Log-2: safeParse', UserSchema.safeParse(user)) // Success { success: true, data: { data: User } }
console.log('Log-3: safeParse', UserSchema.safeParse(user2)) // Error { success: false, error: ZodError }

enum Hobbies {
    Programmer,
    Musician,
    Footballer
}

const hobbies = ['Programmer', 'Musician', 'Footballer'] as const // readonly array

const UserSchema2 = z.object({
    username: z.string().min(3).max(10),
    age: z.number().gt(0), // .bigint(), .gt(0) - Greater than 0, .int() - No decimal point
    price: z.number().default(Math.random()),
    birthday: z.date().optional(), // optional type
    isProgrammer: z.boolean().default(true),
    isRobot: z.boolean().nullable(), // .nullable() - Can be null
    isHuman: z.boolean().nullish(), // .nullable() - Can be null or undefined
    isAnimal: z.literal(true), // .literal() - It always has to be "true"
    email: z.string().email(),
    url: z.string().url(),
    hobby: z.enum(['Programmer', 'Musician', 'Footballer']), // normal enum
    hobby2: z.enum(hobbies), // with pre defined array of values; array need to be readonly
    hobby3: z.nativeEnum(Hobbies) // .nativeEnaum() - infers an enum
    //test: z.undefined(), // always be undefined
    //test2: z.null(), // always be null
    //test3: z.void(), // E.g. function that return void
    //test4: z.any(), // any type
    //test5: z.unknown(), // any type
    //test6: z.never(), // it can never have this test6 key
})

type User2 = z.infer<typeof UserSchema2>

const user3 = {
    username: 'John',
    age: 20,
    birthday: new Date(),
    isRobot: false,
    isAnimal: true,
    email: 'john@gmail.com',
    url: 'https://zod.dev/',
    hobby: 'Programmer',
    hobby2: 'Programmer',
    hobby3: Hobbies.Footballer
}

console.log('Log-4: safeParse', UserSchema2.safeParse(user)) // Error because we don't have all the fields
console.log('Log-5: safeParse', UserSchema2.safeParse(user3)) // Success
console.log('Log-6: safeParse', UserSchema2.shape) // Type of all the keys inside schema
console.log('Log-7: safeParse', UserSchema2.shape.age) // Type of specified key inside schema
console.log('Log-8: safeParse', UserSchema2.partial().safeParse(user)) // Success: All of the keys are optional

// Schema .passthrough(), .strict()

const UserSchema3 = z.object({
    username: z.string()
})

const user4 = {
    username: 'John',
    age: 10
}

console.log('Log-9: parse', UserSchema3.parse(user4)) // Success but age is not shown
console.log('Log-10: Schema.passthrough().parse', UserSchema3.passthrough().parse(user4)) // Success and age is shown
console.log('Log-11: Schema.strict().safeParse', UserSchema3.strict().safeParse(user4)) // Error .strict()

// Array & Tuple

const UserSchema4 = z.object({
    username: z.string(),
    friends: z.array(z.string()).nonempty().min(1).max(10), // .nonempty() - It can't be empty, .length(10) - It needs to have 10 elements
    coords: z.tuple([z.number(), z.string(), z.number()]),
    coords2: z.tuple([z.string(), z.date()]).rest(z.number()) // .rest(z.number()) - Add infinite numbers of keys with type .number()
})

const user5 = {
    username: 'John',
    friends: ['Kyle', 'Julie'],
    coords: [1, 'test', 3],
    coords2: ['test', new Date(), 3, 4, 5, 6, 7, 8, 9]
}

console.log('Log-12: type of array: Schema.shape.friends.element', UserSchema4.shape.friends.element) // Success
console.log('Log-13: parse - ', UserSchema4.parse(user5)) // Success

// Union, Discriminated Union

const UserSchema5 = z.object({
    id: z.union([z.string(), z.number()]), // union type
    id2: z.string().or(z.number()), // union type with different declaration
    id3: z.discriminatedUnion('status', [
        z.object({ status: z.literal('success'), data: z.string() }),
        z.object({ status: z.literal('failed'), data: z.instanceof(Error) })
    ]) // discriminated union type where one field is exactly the same between all of your different things - Why? better performance gains
}).strict()

const user6 = {
    id: 1,
    id2: 'uuid123',
    id3: { status: 'success', data: 'This is success' }
}

console.log('Log-14: Union type - parse', UserSchema5.parse(user6)) // Success

// Record Type
const UserMap = z.record(z.string()) // only string for the values E.g. { "onlystringhere": "Something" }

const user7 = {
    sdfghj: "Hello",
    ertzuipmnbv: "World",
}

const user8 = {
    sdfghj: "Hello",
    ertzuipmnbv: 8,
}

console.log('Log-15: Record type - safeParse - Success', UserMap.safeParse(user7)) // Success
console.log('Log-16: Record type - safeParse - Error', UserMap.safeParse(user8)) // Error

// Map Type
const UserMap2 = z.map(z.string(), z.object({ name: z.string() })) // E.g. [ "anystringhere", { name: "anystringhere" } ]

const user9 = new Map([
    ['id-john', { name: 'John' }],
    ['id-kyle', { name: 'Kyle' }],
])

console.log('Log-17: Map type - safeParse - Success', UserMap2.safeParse(user9)) // Success

// Set Type

const SetSchema = z.set(z.number())

const user10 = new Set([1, 1, 1, 2])

console.log('Log-18: Set type', SetSchema.safeParse(user10)) // Success

// Promise Type

const PromiseSchema = z.promise(z.string())

const p = Promise.resolve('resolved')

console.log('Log-19: Promise type', PromiseSchema.safeParse(p)) // Success

// Advance validation

const brandEmail = z
    .string()
    .email()
    .refine(val => val.endsWith('@gmail.com'), {
        message: "Email must end with @gmail.com",
    })

const email = 'john@gmail.com'
const email2 = 'john@hotmail.com'

console.log('Log-20: Advanced validation - .refine() - safeParse', brandEmail.safeParse(email)) // Success
console.log('Log-21: Advanced validation - .refine() - safeParse', brandEmail.safeParse(email2)) // Error

// Error handling
const UserSchema6 = z.object({
    username: z.string().min(3, 'Username must have minimum of 3 characters.'),
    coords2: z.tuple([z.string(), z.date()]).rest(z.number())
}).strict()

const user11 = {
    username: 'Jo',
    coords2: ['test', new Date(), 3, 4, 5, 6, 7, 8, 9]
}

const result = UserSchema6.safeParse(user11)

if (!result.success) {
    console.log('Log-22: Error handling - safeParse', fromZodError(result.error)) // Error: Handling errors
}