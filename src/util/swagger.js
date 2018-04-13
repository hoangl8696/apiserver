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
 *       imageId:
 *         type: string
 */

  /**
 * @swagger
 * definitions:
 *   User full info:
 *     type: object
 *     properties:
 *       method:
 *         type: string
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
 *       contentfulId:
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

 /**
 * @swagger
 * definitions:
 *   Avatar:
 *     type: object
 *     properties:
 *       fieldname:
 *         type: string
 *       originalname:
 *         type: string
 *       encoding:
 *         type: string
 *       mimetype:
 *         type: string
 *       id:
 *         type: number
 *       filename:
 *          type: string
 *       metadata:
 *          type: number
 *       bucketName:
 *          type: string
 *       chunkSize:
 *          type: string
 *       size:
 *          type: string
 *       md5:
 *          type: number
 *       uploadDate:
 *          type: string
 *       contentType:
 *          type: string
 */

 /**
 * @swagger
 * definitions:
 *   Avatar summary:
 *     type: object
 *     properties:
 *       _id:
 *         type: string
 *       length:
 *         type: string
 *       chunkSize:
 *         type: string
 *       uploadDate:
 *         type: string
 *       md5:
 *         type: number
 *       filename:
 *          type: string
 *       contentType:
 *          type: number
 */

 /**
 * @swagger
 * definitions:
 *   Links:
 *     type: object
 *     properties:
 *          sys:
 *             type: object
 *             properties:
 *                  type:
 *                      type: string
 *                  linkType:
 *                      type: string
 *                  id:
 *                      type: string
 */

  /**
 * @swagger
 * definitions:
 *   Images:
 *     type: object
 *     properties:
 *          title:
 *             type: object
 *             properties:
 *                  en-GB:
 *                      type: string
 *          file:
 *             type: object
 *             properties:
 *                  en-GB:
 *                      type: object
 *                      properties:
 *                          url:
 *                              type: string
 *                          details:
 *                              type: object
 *                              properties:
 *                                  size:
 *                                      type: number
 *                                  image:
 *                                      type: object
 *                                      properties:
 *                                          width:
 *                                              type: number
 *                                          height:
 *                                              type: number
 *                          fileName:
 *                              type: string
 *                          contentType:
 *                              type: string
 */

 /**
 * @swagger
 * definitions:
 *   Contentful Image:
 *     type: object
 *     properties:
 *       sys:
 *         type: object
 *         properties:
 *             space:
 *                  $ref: '#/definitions/Links'
 *             id:
 *                  type: string
 *             type:
 *                  type: string
 *             createdAt:
 *                  type: string
 *             updatedAt:
 *                  type: string
 *             createdBy:
 *                  $ref: '#/definitions/Links'
 *             updatedBy:
 *                  $ref: '#/definitions/Links'
 *             publishedCounter:
 *                  type: number
 *             version:
 *                  type: number
 *             publishedBy:
 *                  $ref: '#/definitions/Links'
 *             publishedVersion:
 *                  type: number
 *             firstPublishedAt:
 *                  type: string
 *             publishedAt:
 *                  type: string  
 *       fields:
 *         type: object
 *         properties:
 *              title:
 *                  type: object
 *                  properties:
 *                      en-GB:
 *                          type: string
 *              file:
 *                  $ref: '#/definitions/Images'
 */

  /**
 * @swagger
 * definitions:
 *   Contentful User:
 *      type: object
 *      properties:
 *          sys:
 *              type: object
 *              properties:
 *                  space:
 *                      $ref: '#/definitions/Links'
 *                  id:
 *                      type: string
 *                  type:
 *                      type: string
 *                  createdAt:
 *                      type: string
 *                  updatedAt:
 *                      type: string
 *                  revision:
 *                      type: number
 *                  contentType:
 *                      type: object
 *                      properties:
 *                          sys:
 *                              $ref: '#/definitions/Links'
 *                  locale:
 *                      type: string
 *          fields:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  uploads:
 *                      type: array
 *                      items:
 *                          type: object
 *                          properties:
 *                              sys:
 *                                  type: object
 *                                  properties:
 *                                      space:
 *                                          type: object
 *                                          properties:
 *                                              sys:
 *                                                  $ref: '#/definitions/Links'
 *                                      id:
 *                                          type: string
 *                                      type:
 *                                          type: string
 *                                      createdAt:
 *                                          type: string
 *                                      updatedAt:
 *                                          type: string
 *                                      revision:
 *                                          type: number
 *                                      locale:
 *                                          type: string
 *                              fields:
 *                                  $ref: '#/definitions/Images'
 */