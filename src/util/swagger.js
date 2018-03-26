/**
* @swagger
 *definitions:
 *  Update Information:
 *    type: object
 *    properties:
 *      name:
 *          type: string
 *      age:
 *          type: number
 *      description:
 *          type: string                          
*/

 /**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       __v:
 *         type: number
 */

  /**
 * @swagger
 * definitions:
 *   User Images:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       id:
 *         type: string
 *       __v:
 *         type: number
 */

  /**
 * @swagger
 * definitions:
 *   User full info:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       email:
 *         type: string
 *       password:
 *         type: string
 *       __v:
 *         type: number
 *       name:
 *          type: string
 *       age:
 *          type: number
 *       description:
 *          type: string
 *       uploads:
 *          type: array
 *          items:
 *              $ref: '#/definitions/User Images'
 */
 
/**
 * @swagger
 * definitions:
 *   Credentials:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *       password:
 *         type: string
 */

