using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobsController : ControllerBase
{
    private readonly JobRepository _repository;

    public JobsController(JobRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult Get(int id)
    {
        var entity = _repository.GetById(id);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Job entity)
    {
        _repository.Insert(entity);
        return Ok(entity);
    }

    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Job entity)
    {
        entity.JobId = id;
        _repository.Update(entity);
        return Ok(entity);
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        _repository.Delete(id);
        return NoContent();
    }
}
